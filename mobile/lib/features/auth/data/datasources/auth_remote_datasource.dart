import 'package:dio/dio.dart';
import 'package:taskflow/core/network/api_client.dart';
import 'package:taskflow/features/auth/data/models/auth_models.dart';

class AuthRemoteDatasource {
  final ApiClient _apiClient;

  AuthRemoteDatasource(this._apiClient);

  Future<AuthResponseModel> login({
    required String email,
    required String password,
  }) async {
    final response = await _apiClient.dio.post('/auth/login', data: {
      'email': email,
      'password': password,
    });
    return AuthResponseModel.fromJson(
        response.data['data'] as Map<String, dynamic>);
  }

  Future<AuthResponseModel> register({
    required String name,
    required String email,
    required String password,
  }) async {
    final response = await _apiClient.dio.post('/auth/register', data: {
      'name': name,
      'email': email,
      'password': password,
    });
    return AuthResponseModel.fromJson(
        response.data['data'] as Map<String, dynamic>);
  }

  Future<void> logout(String refreshToken) async {
    await _apiClient.dio.post('/auth/logout', data: {
      'refreshToken': refreshToken,
    });
  }

  Future<UserModel> getMe() async {
    final response = await _apiClient.dio.get('/auth/me');
    return UserModel.fromJson(
        response.data['data']['user'] as Map<String, dynamic>);
  }
}
