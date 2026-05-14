package com.kreedaankana.model

import com.google.firebase.Timestamp

data class Booking(
    val id: String = "",
    val userId: String = "",
    val teamName: String = "",
    val date: String = "",
    val startTime: String = "",
    val endTime: String = "",
    val sport: String = "",
    val createdAt: Timestamp? = null
)

data class Challenge(
    val id: String = "",
    val creatorId: String = "",
    val creatorName: String = "",
    val creatorTeam: String = "",
    val title: String = "",
    val description: String = "",
    val sport: String = "",
    val status: String = "open",
    val date: String = "",
    val startTime: String = "",
    val endTime: String = "",
    val createdAt: Timestamp? = null
)

data class Score(
    val id: String = "",
    val matchTitle: String = "",
    val teamA: String = "",
    val teamB: String = "",
    val scoreA: Int = 0,
    val scoreB: Int = 0,
    val sport: String = "",
    val isLive: Boolean = true,
    val updatedAt: Timestamp? = null
)
