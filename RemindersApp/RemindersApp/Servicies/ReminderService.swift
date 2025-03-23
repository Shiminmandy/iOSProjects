//
//  ReminderService.swift
//  RemindersApp
//
//  Created by Shimin Cheng on 2025-03-02.
//

import Foundation
import CoreData
import UIKit

enum ReminderStatType{
    
    case today
    case all
    case scheduled
    case completed
    
}
// provide utility functions to interact with core data, operating creation, deletion, updating logic of reminders and lists
class ReminderService{
    
    static var viewContext: NSManagedObjectContext{
        CoreDataProvider.shared.persistentContainer.viewContext
    }
    
    static func save() throws{
        try viewContext.save()
    }
    
    static func saveMyList(_ name: String, _ color: UIColor) throws {
        
        let myList = MyList(context: viewContext)
        myList.name = name
        myList.color = color
        try save()
    }
    
    static func updateReminder(reminder: Reminder, editConfig: ReminderEditConfig) throws -> Bool{
        
        //可不写的一步
        let reminderToUpdate = reminder
        
        reminderToUpdate.isCompleted = editConfig.isCompleted
        reminderToUpdate.title = editConfig.title
        reminderToUpdate.notes = editConfig.notes
        reminderToUpdate.reminderDate = editConfig.hasDate ? editConfig.reminderDate: nil
        
        try save()
        return true
    }
    
    static func saveReminderToMyList(myList: MyList, reminderTitle: String) throws{
        let reminder = Reminder(context: viewContext)
        reminder.title = reminderTitle
        myList.addToReminders(reminder)
        try save()
    }
    
    static func deleteReminder(_ reminder: Reminder) throws {
        
        viewContext.delete(reminder)
        try save()
    }
    
    static func getRemindersBySearchTerm(_ searchTerm: String) -> NSFetchRequest<Reminder>{
        let request = Reminder.fetchRequest()
        request.sortDescriptors = []  // sort order = []
        request.predicate  = NSPredicate(format: "title CONTAINS[cd] %@", searchTerm) // filter reminders
        return request
    }
    
    static func remindersByStatType(statType: ReminderStatType) -> NSFetchRequest<Reminder>{
        
        let request = Reminder.fetchRequest()
        request.sortDescriptors = []
        
        switch statType{
        case .all:
            request.predicate = NSPredicate(format: "isCompleted = false")
        case .today:
            let today = Date()
            let tomorrow = Calendar.current.date(byAdding: .day, value: 1, to: today)
            request.predicate = NSPredicate(format: "(reminderDate BETWEEN {%@, %@}) OR (reminderTime BETWEEN {%@, %@})", today  as NSDate, tomorrow! as NSDate,today  as NSDate, tomorrow! as NSDate)
        case .scheduled:
            request.predicate = NSPredicate(format: "(reminderDate != nil OR reminderTime != nil) AND isCompleted = false")
        case .completed:
            request.predicate = NSPredicate(format: "isCompleted = true")
        }
        return request
    }
    
    static func getRemindersByList(myList: MyList) -> NSFetchRequest<Reminder>{
        
        let request = Reminder.fetchRequest()
        request.sortDescriptors = []
        request.predicate = NSPredicate(format: "list = %@ AND isCompleted = false", myList)
        // if the isCompleted changed from false to true, the reminder list view will gone
        return request
    }
    
}
