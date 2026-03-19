import 'package:dio/dio.dart';
import 'package:taskflow/core/constants/app_constants.dart';
import 'package:taskflow/core/storage/storage_service.dart';

class ApiClient {
  late final Dio _dio;
  final StorageService _storage;
  bool _isRefreshing = false;

  ApiClient(this._storage) {
    _dio = Dio(BaseOptions(
      baseUrl: AppConstants.baseUrl,
      connectTimeout: const Duration(seconds: 15),
      receiveTimeout: const Duration(seconds: 15),
      headers: {'Content-Type': 'application/json'},
    ));

    _dio.interceptors.add(_authInterceptor());
  }

  Dio get dio => _dio;

  Interceptor _authInterceptor() {
    return InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await _storage.getAccessToken();
        if (token != null) {
          options.headers['Authorization'] = '${AppConstants.bearerPrefix}$token';
        }
        handler.next(options);
      },
      onError: (error, handler) async {
        if (error.response?.statusCode == 401 && !_isRefreshing) {
          _isRefreshing = true;
          try {
            final refreshToken = await _storage.getRefreshToken();
            if (refreshToken == null) {
              await _storage.clearAll();
              handler.next(error);
              return;
            }

            // Refresh tokens
            final response = await Dio().post(
              '${AppConstants.baseUrl}/auth/refresh',
              data: {'refreshToken': refreshToken},
            );

            final data = response.data['data'];
            await _storage.saveAccessToken(data['accessToken']);
            await _storage.saveRefreshToken(data['refreshToken']);

            // Retry original request
            final opts = error.requestOptions;
            opts.headers['Authorization'] =
                '${AppConstants.bearerPrefix}${data['accessToken']}';
            final retryResponse = await _dio.fetch(opts);
            handler.resolve(retryResponse);
          } catch (_) {
            await _storage.clearAll();
            handler.next(error);
          } finally {
            _isRefreshing = false;
          }
        } else {
          handler.next(error);
        }
      },
    );
  }
}
