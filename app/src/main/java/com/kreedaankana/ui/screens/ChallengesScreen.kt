package com.kreedaankana.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.kreedaankana.model.Challenge
import com.kreedaankana.service.FirestoreService

@Composable
fun ChallengesScreen() {
    val firestoreService = FirestoreService()
    val challenges by firestoreService.getChallenges().collectAsState(initial = emptyList())

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(onClick = { /* New Challenge */ }) {
                Icon(Icons.Filled.Add, contentDescription = "Add")
            }
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp)
        ) {
            Text(
                text = "Open Challenges",
                style = MaterialTheme.typography.headlineSmall,
                fontWeight = FontWeight.Bold
            )
            
            Spacer(modifier = Modifier.height(16.dp))

            LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                items(challenges) { challenge ->
                    ChallengeItem(challenge)
                }
            }
        }
    }
}

@Composable
fun ChallengeItem(challenge: Challenge) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFF1F5F9))
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(horizontalArrangement = Arrangement.SpaceBetween, modifier = Modifier.fillMaxWidth()) {
                Text(
                    text = challenge.status.uppercase(),
                    style = MaterialTheme.typography.labelSmall,
                    color = Color(0xFF10B981)
                )
                Text(
                    text = challenge.date,
                    style = MaterialTheme.typography.labelSmall,
                    color = Color.Gray
                )
            }
            Text(
                text = challenge.title,
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Black,
                modifier = Modifier.padding(vertical = 4.dp)
            )
            Text(
                text = "${challenge.sport.uppercase()} • ${challenge.startTime}-${challenge.endTime}",
                style = MaterialTheme.typography.labelSmall,
                color = Color.Gray
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = "\"${challenge.description}\"",
                style = MaterialTheme.typography.bodySmall,
                color = Color.Gray
            )
            Divider(modifier = Modifier.padding(vertical = 12.dp), color = Color(0xFFF8FAFC))
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                Column {
                    Text("POSTED BY", style = MaterialTheme.typography.labelSmall, color = Color.LightGray)
                    Text(
                        text = "${challenge.creatorName} @${challenge.creatorTeam}",
                        style = MaterialTheme.typography.bodySmall,
                        fontWeight = FontWeight.Bold
                    )
                }
                Button(onClick = { /* Reply */ }, shape = MaterialTheme.shapes.small) {
                    Text("Reply")
                }
            }
        }
    }
}
