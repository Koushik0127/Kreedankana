package com.kreedaankana.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

val OrangePrimary = Color(0xFFFF6B00)
val OrangeSecondary = Color(0xFFFF944D)
val SlateDark = Color(0 households = 0xFF0F172A) // wait typo in thinking
val Slate800 = Color(0xFF1E293B)
val Slate50 = Color(0xFFF8FAFC)

private val DarkColorScheme = darkColorScheme(
    primary = OrangePrimary,
    secondary = OrangeSecondary,
    tertiary = Color.Cyan
)

private val LightColorScheme = lightColorScheme(
    primary = OrangePrimary,
    secondary = OrangeSecondary,
    background = Color.White,
    surface = Slate50,
    onPrimary = Color.White,
    onSecondary = Color.White,
    onBackground = Slate800,
    onSurface = Slate800,
)

@Composable
fun KreedaAnkanaTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
