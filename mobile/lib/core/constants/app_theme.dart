import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  AppTheme._();

  static const Color primary = Color(0xFF6C47FF);
  static const Color primaryLight = Color(0xFFEEE9FF);
  static const Color background = Color(0xFFF5F5F7);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color textPrimary = Color(0xFF0F1729);
  static const Color textSecondary = Color(0xFF6B7280);
  static const Color border = Color(0xFFE5E7EB);
  static const Color error = Color(0xFFEF4444);
  static const Color success = Color(0xFF10B981);
  static const Color warning = Color(0xFFF59E0B);
  static const Color info = Color(0xFF3B82F6);

  // Status colors
  static const Color pendingColor = Color(0xFFF59E0B);
  static const Color pendingBg = Color(0xFFFFFBEB);
  static const Color inProgressColor = Color(0xFF3B82F6);
  static const Color inProgressBg = Color(0xFFEFF6FF);
  static const Color completedColor = Color(0xFF10B981);
  static const Color completedBg = Color(0xFFECFDF5);

  // Priority colors
  static const Color lowColor = Color(0xFF6B7280);
  static const Color lowBg = Color(0xFFF9FAFB);
  static const Color mediumColor = Color(0xFF6C47FF);
  static const Color mediumBg = Color(0xFFEEE9FF);
  static const Color highColor = Color(0xFFEF4444);
  static const Color highBg = Color(0xFFFEF2F2);

  static ThemeData get theme => ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: primary,
          background: background,
          surface: surface,
          error: error,
        ),
        scaffoldBackgroundColor: background,
        textTheme: GoogleFonts.dmSansTextTheme().copyWith(
          displayLarge: GoogleFonts.syne(
            fontSize: 32,
            fontWeight: FontWeight.w800,
            color: textPrimary,
          ),
          displayMedium: GoogleFonts.syne(
            fontSize: 24,
            fontWeight: FontWeight.w700,
            color: textPrimary,
          ),
          titleLarge: GoogleFonts.syne(
            fontSize: 20,
            fontWeight: FontWeight.w700,
            color: textPrimary,
          ),
          titleMedium: GoogleFonts.syne(
            fontSize: 16,
            fontWeight: FontWeight.w600,
            color: textPrimary,
          ),
          bodyLarge: GoogleFonts.dmSans(
            fontSize: 16,
            color: textPrimary,
          ),
          bodyMedium: GoogleFonts.dmSans(
            fontSize: 14,
            color: textPrimary,
          ),
          bodySmall: GoogleFonts.dmSans(
            fontSize: 12,
            color: textSecondary,
          ),
        ),
        appBarTheme: AppBarTheme(
          backgroundColor: surface,
          elevation: 0,
          scrolledUnderElevation: 1,
          shadowColor: border,
          titleTextStyle: GoogleFonts.syne(
            fontSize: 20,
            fontWeight: FontWeight.w700,
            color: textPrimary,
          ),
          iconTheme: const IconThemeData(color: textPrimary),
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: primary,
            foregroundColor: Colors.white,
            minimumSize: const Size(double.infinity, 52),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(14),
            ),
            textStyle: GoogleFonts.dmSans(
              fontSize: 15,
              fontWeight: FontWeight.w600,
            ),
            elevation: 0,
          ),
        ),
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: surface,
          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: border),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: border),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: primary, width: 1.5),
          ),
          errorBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: error),
          ),
          focusedErrorBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: error, width: 1.5),
          ),
          hintStyle: GoogleFonts.dmSans(color: textSecondary, fontSize: 14),
          labelStyle: GoogleFonts.dmSans(color: textSecondary, fontSize: 14),
        ),
        cardTheme: CardTheme(
          color: surface,
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
            side: const BorderSide(color: border),
          ),
          margin: EdgeInsets.zero,
        ),
        dividerTheme: const DividerThemeData(color: border, space: 0),
        snackBarTheme: SnackBarThemeData(
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          contentTextStyle: GoogleFonts.dmSans(fontSize: 14),
        ),
      );
}
