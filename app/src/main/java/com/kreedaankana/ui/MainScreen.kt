package com.kreedaankana.ui

import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.DateRange
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.Send
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.kreedaankana.ui.screens.DashboardScreen
import com.kreedaankana.ui.screens.BookingScreen
import com.kreedaankana.ui.screens.ChallengesScreen
import com.kreedaankana.ui.screens.ScoreWallScreen
import com.kreedaankana.ui.screens.LoginScreen

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainScreen() {
    val navController = rememberNavController()
    var selectedItem by remember { mutableStateOf(0) }
    var isAuthenticated by remember { mutableStateOf(com.google.firebase.auth.ktx.auth.currentUser != null) }
    
    val items = listOf("Home", "Book", "Challenges", "Scores")
    val icons = listOf(Icons.Filled.Home, Icons.Filled.DateRange, Icons.Filled.Send, Icons.Filled.Notifications)

    if (!isAuthenticated) {
        LoginScreen(onLoginSuccess = { isAuthenticated = true })
    } else {
        Scaffold(
        bottomBar = {
            NavigationBar {
                items.forEachIndexed { index, item ->
                    NavigationBarItem(
                        icon = { Icon(icons[index], contentDescription = item) },
                        label = { Text(item) },
                        selected = selectedItem == index,
                        onClick = {
                            selectedItem = index
                            when (index) {
                                0 -> navController.navigate("dashboard")
                                1 -> navController.navigate("booking")
                                2 -> navController.navigate("challenges")
                                3 -> navController.navigate("scores")
                            }
                        }
                    )
                }
            }
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = "dashboard",
            modifier = Modifier.padding(innerPadding)
        ) {
            composable("dashboard") { DashboardScreen() }
            composable("booking") { BookingScreen() }
            composable("challenges") { ChallengesScreen() }
            composable("scores") { ScoreWallScreen() }
        }
    }
}
}
