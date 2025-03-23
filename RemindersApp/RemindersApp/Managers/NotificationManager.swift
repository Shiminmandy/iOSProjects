//
//  NotificationManager.swift
//  RemindersApp
//
//  Created by Shimin Cheng on 2025-03-23.
//

import Foundation
import UserNotifications

struct UserDate{
    
    let title: String?
    let body: String?
    let date: Date?
    let time: Date?
}

class NotificationManager{
    
    static func scheduleNotification(userDate: UserDate){
        
        let content = UNMutableNotificationContent()
        content.title = userDate.title ?? ""
        
        content.body = userDate.body ?? ""   // body are notes in Reminder
        
        // date components
        var dateComponents = Calendar.current.dateComponents([.year,.month,.day,.hour,.minute], from: userDate.date ?? Date())
        
        if let reminderTime = userDate.time{
            let reminderTimeDateComponents = reminderTime.dateComponents
            dateComponents.hour = reminderTimeDateComponents.hour
            dateComponents.minute = reminderTimeDateComponents.minute
        }
        
        let trigger = UNCalendarNotificationTrigger(dateMatching: dateComponents, repeats: false)
        let request = UNNotificationRequest(identifier: "Reminder Notification", content: content, trigger: trigger)
        UNUserNotificationCenter.current().add(request)
    }
}
