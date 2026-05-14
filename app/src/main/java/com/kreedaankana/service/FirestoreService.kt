package com.kreedaankana.service

import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.Query
import com.google.firebase.firestore.ktx.firestore
import com.google.firebase.ktx.Firebase
import com.kreedaankana.model.Booking
import com.kreedaankana.model.Challenge
import com.kreedaankana.model.Score
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow

class FirestoreService {
    private val db = Firebase.firestore

    fun getBookings(date: String): Flow<List<Booking>> = callbackFlow {
        val subscription = db.collection("bookings")
            .whereEqualTo("date", date)
            .addSnapshotListener { snapshot, error ->
                if (error != null) return@addSnapshotListener
                if (snapshot != null) {
                    val bookings = snapshot.toObjects(Booking::class.java)
                    trySend(bookings)
                }
            }
        awaitClose { subscription.remove() }
    }

    fun getChallenges(): Flow<List<Challenge>> = callbackFlow {
        val subscription = db.collection("challenges")
            .orderBy("createdAt", Query.Direction.DESCENDING)
            .addSnapshotListener { snapshot, error ->
                if (error != null) return@addSnapshotListener
                if (snapshot != null) {
                    val challenges = snapshot.toObjects(Challenge::class.java)
                    trySend(challenges)
                }
            }
        awaitClose { subscription.remove() }
    }

    fun getScores(): Flow<List<Score>> = callbackFlow {
        val subscription = db.collection("scores")
            .orderBy("updatedAt", Query.Direction.DESCENDING)
            .addSnapshotListener { snapshot, error ->
                if (error != null) return@addSnapshotListener
                if (snapshot != null) {
                    val scores = snapshot.toObjects(Score::class.java)
                    trySend(scores)
                }
            }
        awaitClose { subscription.remove() }
    }

    suspend fun addBooking(booking: Booking) {
        db.collection("bookings").add(booking)
    }

    suspend fun addChallenge(challenge: Challenge) {
        db.collection("challenges").add(challenge)
    }
}
