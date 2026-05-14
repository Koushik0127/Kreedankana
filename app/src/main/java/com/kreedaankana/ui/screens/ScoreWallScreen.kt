package com.kreedaankana.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.kreedaankana.service.FirestoreService

@Composable
fun ScoreWallScreen() {
    val firestoreService = FirestoreService()
    val scores by firestoreService.getScores().collectAsState(initial = emptyList())

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Text(
            text = "Ankana Scoreboard",
            style = MaterialTheme.typography.headlineSmall,
            fontWeight = FontWeight.Bold
        )
        
        Spacer(modifier = Modifier.height(16.dp))

        LazyColumn(verticalArrangement = Arrangement.spacedBy(16.dp)) {
            items(scores) { score ->
                ScoreCard(score) // Reusing the ScoreCard from Dashboard
            }
        }
    }
}
