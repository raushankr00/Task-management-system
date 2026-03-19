class AppConstants {
  AppConstants._();

  // API
  static const String baseUrl = 'http://10.0.2.2:5000/api'; // Android emulator
  // static const String baseUrl = 'http://localhost:5000/api'; // iOS simulator

  // Storage Keys
  static const String accessTokenKey = 'access_token';
  static const String refreshTokenKey = 'refresh_token';
  static const String userKey = 'user_data';

  // Token
  static const String bearerPrefix = 'Bearer ';

  // Pagination
  static const int defaultPageSize = 10;
}
