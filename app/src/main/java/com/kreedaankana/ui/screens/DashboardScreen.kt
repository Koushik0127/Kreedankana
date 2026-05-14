package com.kreedaankana.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.kreedaankana.model.Score
import com.kreedaankana.service.FirestoreService

@Composable
fun DashboardScreen() {
    val firestoreService = FirestoreService()
    val scores by firestoreService.getScores().collectAsState(initial = emptyList())

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Column(modifier = Modifier.padding(vertical = 16.dp)) {
                Text(
                    text = "Kreeda Ankana",
                    style = MaterialTheme.typography.headlineLarge,
                    color = MaterialTheme.colorScheme.primary,
                    fontWeight = FontWeight.ExtraBold
                )
                Text(
                    text = "Welcome to the Arena",
                    style = MaterialTheme.typography.bodyMedium,
                    color = Color.Gray
                )
            }
        }

        item {
            Text(
                text = "Live Scores",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold
            )
        }

        if (scores.isEmpty()) {
            item {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(100.dp)
                        .background(Color(0xFFF1F5F9), RoundedCornerShape(16.dp)),
                    contentAlignment = Alignment.Center
                ) {
                    Text("No live matches right now", color = Color.Gray)
                }
            }
        }

        items(scores.take(3)) { score ->
            ScoreCard(score)
        }
    }
}

@Composable
fun ScoreCard(score: Score) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(
                text = score.sport.uppercase(),
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.primary
            )
            Text(
                text = score.matchTitle,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(8.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                TeamScore(score.teamA, score.scoreA)
                Text("VS", fontWeight = FontWeight.Black, fontSize = 12.sp)
                TeamScore(score.teamB, score.scoreB)
            }
        }
    }
}

@Composable
fun TeamScore(name: String, score: Int) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(text = name, style = MaterialTheme.typography.bodySmall)
        Text(
            text = score.toString(),
            style = MaterialTheme.typography.headlineMedium,
            fontWeight = FontWeight.ExtraBold
        )
    }
}
