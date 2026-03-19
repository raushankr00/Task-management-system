import 'dart:convert';
import 'package:taskflow/core/storage/storage_service.dart';
import 'package:taskflow/features/auth/data/datasources/auth_remote_datasource.dart';
import 'package:taskflow/features/auth/data/models/auth_models.dart';

class AuthRepository {
  final AuthRemoteDatasource _datasource;
  final StorageService _storage;

  AuthRepository(this._datasource, this._storage);

  Future<UserModel> login({
    required String email,
    required String password,
  }) async {
    final result = await _datasource.login(email: email, password: password);
    await _storage.saveAccessToken(result.accessToken);
    await _storage.saveRefreshToken(result.refreshToken);
    await _storage.saveUserData(jsonEncode(result.user.toJson()));
    return result.user;
  }

  Future<UserModel> register({
    required String name,
    required String email,
    required String password,
  }) async {
    final result = await _datasource.register(
        name: name, email: email, password: password);
    await _storage.saveAccessToken(result.accessToken);
    await _storage.saveRefreshToken(result.refreshToken);
    await _storage.saveUserData(jsonEncode(result.user.toJson()));
    return result.user;
  }

  Future<void> logout() async {
    final refreshToken = await _storage.getRefreshToken();
    if (refreshToken != null) {
      try {
        await _datasource.logout(refreshToken);
      } catch (_) {}
    }
    await _storage.clearAll();
  }

  Future<UserModel?> getCurrentUser() async {
    final userData = await _storage.getUserData();
    if (userData == null) return null;
    try {
      return UserModel.fromJson(jsonDecode(userData) as Map<String, dynamic>);
    } catch (_) {
      return null;
    }
  }

  Future<bool> isLoggedIn() async {
    final token = await _storage.getAccessToken();
    return token != null;
  }
}
