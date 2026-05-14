package com.kreedaankana.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.kreedaankana.model.Booking
import com.kreedaankana.service.FirestoreService
import java.util.Calendar

@Composable
fun BookingScreen() {
    val firestoreService = FirestoreService()
    var selectedDate by remember { mutableStateOf("2026-05-14") } // Default date
    val bookings by firestoreService.getBookings(selectedDate).collectAsState(initial = emptyList())

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Text(
            text = "Arena Timings",
            style = MaterialTheme.typography.headlineSmall,
            fontWeight = FontWeight.Bold
        )
        Text(
            text = "Check availability and book your slot",
            style = MaterialTheme.typography.bodySmall,
            color = Color.Gray
        )
        
        Spacer(modifier = Modifier.height(16.dp))

        // Basic Time Slots List
        val timeSlots = (6..22).map { String.format("%02d:00", it) }

        LazyColumn(
            modifier = Modifier.weight(1.0f),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(timeSlots) { time ->
                val booking = bookings.find { it.startTime <= time && it.endTime > time }
                TimeSlotItem(time, booking)
            }
        }
        
        Button(
            onClick = { /* Open Booking Form */ },
            modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp),
            shape = MaterialTheme.shapes.medium
        ) {
            Text("Request New Booking")
        }
    }
}

@Composable
fun TimeSlotItem(time: String, booking: Booking?) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        horizontalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Text(
            text = time,
            style = MaterialTheme.typography.labelMedium,
            color = Color.Gray,
            modifier = Modifier.width(45.dp)
        )
        
        if (booking != null) {
            Surface(
                modifier = Modifier.fillMaxWidth(),
                color = MaterialTheme.colorScheme.primaryContainer,
                shape = MaterialTheme.shapes.small
            ) {
                Column(modifier = Modifier.padding(12.dp)) {
                    Text(
                        text = booking.teamName,
                        style = MaterialTheme.typography.bodyMedium,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = booking.sport,
                        style = MaterialTheme.typography.labelSmall
                    )
                }
            }
        } else {
            Surface(
                modifier = Modifier.fillMaxWidth(),
                color = Color(0xFFF8FAFC),
                shape = MaterialTheme.shapes.small,
                border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFE2E8F0))
            ) {
                Box(modifier = Modifier.padding(12.dp)) {
                    Text("Available", style = MaterialTheme.typography.bodySmall, color = Color.LightGray)
                }
            }
        }
    }
}
