//
//  ReminderStatsBuilder.swift
//  RemindersApp
//
//  Created by Shimin Cheng on 2025-03-22.
//

import Foundation
import SwiftUI

struct ReminderStatsValues {
    var todayCount: Int = 0
    var scheduledCount: Int = 0
    var allCount: Int = 0
    var completedCount: Int = 0
}

struct ReminderStatsBuilder {
    
    func build(myListResults: FetchedResults<MyList>) -> ReminderStatsValues{
        
        let remindersArray = myListResults.map{
            $0.remindersArray
        }.reduce([], +)
        
        let allCount = calculateAllCount(reminders: remindersArray)
        let completedCount = calculateCompletedCount(reminderes: remindersArray)
        let todaysCont = calculateTodaysCount(reminders: remindersArray)
        let scheduledCount = calculateScheduledCount(reminderes: remindersArray)
        
        return ReminderStatsValues(todayCount: todaysCont, scheduledCount: scheduledCount,allCount: allCount,completedCount: completedCount)
    }
    
    private func calculateScheduledCount(reminderes: [Reminder]) -> Int {
        return reminderes.reduce(0) { result, reminder in
            return ((reminder.reminderDate != nil || reminder.reminderTime != nil) && !reminder.isCompleted) ? result + 1 : result
        }
    }
    
    private func calculateTodaysCount(reminders: [Reminder]) -> Int {
        return reminders.reduce(0) { result, reminder in
            let isToday = reminder.reminderDate?.isToday ?? false
            return isToday ? result + 1 : result
        }
    }
    
    private func calculateCompletedCount(reminderes: [Reminder]) -> Int {
        return reminderes.reduce(0) { result, reminder in
            return reminder.isCompleted ? result + 1 : result
        }
    }
    
    private func calculateAllCount(reminders: [Reminder]) -> Int {
        return reminders.reduce(0) {result, reminder in
            return !reminder.isCompleted ? result + 1 : result
        }
    }
}
