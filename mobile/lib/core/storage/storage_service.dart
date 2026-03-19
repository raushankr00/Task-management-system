import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:taskflow/core/constants/app_constants.dart';

class StorageService {
  final FlutterSecureStorage _storage;

  StorageService() : _storage = const FlutterSecureStorage(
    aOptions: AndroidOptions(encryptedSharedPreferences: true),
  );

  Future<void> saveAccessToken(String token) =>
      _storage.write(key: AppConstants.accessTokenKey, value: token);

  Future<void> saveRefreshToken(String token) =>
      _storage.write(key: AppConstants.refreshTokenKey, value: token);

  Future<String?> getAccessToken() =>
      _storage.read(key: AppConstants.accessTokenKey);

  Future<String?> getRefreshToken() =>
      _storage.read(key: AppConstants.refreshTokenKey);

  Future<void> saveUserData(String json) =>
      _storage.write(key: AppConstants.userKey, value: json);

  Future<String?> getUserData() =>
      _storage.read(key: AppConstants.userKey);

  Future<void> clearAll() => _storage.deleteAll();
}
