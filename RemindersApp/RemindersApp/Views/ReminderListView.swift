//
//  ReminderListView.swift
//  RemindersApp
//
//  Created by Shimin Cheng on 2025-03-07.
//

import SwiftUI

struct ReminderListView: View {
    
    @State private var selectedReminder: Reminder?
    @State private var showReminderDetail: Bool = false
    //we dont get from core data
    let reminders: FetchedResults<Reminder>
    
    // 点击后，状态取反
    private func reminderCheckedChanged(reminder: Reminder, isCompleted: Bool){
        var editConfig = ReminderEditConfig(reminder: reminder)
        editConfig.isCompleted = isCompleted
        
        do {
            let _ = try ReminderService.updateReminder(reminder: reminder, editConfig: editConfig)
        }catch{
            print(error)
        }
    }
    
    private func isReminderSelected(_ reminder: Reminder) -> Bool {
        // objectID from CoreData
        selectedReminder?.objectID == reminder.objectID
    }
    
    var body: some View {
        List(reminders) {reminder in
            ReminderCellView(reminder: reminder,isSelected: isReminderSelected(reminder), onEvent: {event in
                switch event{
                case .onCheckChange(let reminder, let isCompleted):
                    reminderCheckedChanged(reminder: reminder, isCompleted: isCompleted)
                    
                case .onSelect(let reminder):
                    selectedReminder = reminder
                    
                case .onInfo:
                    showReminderDetail = true
                }
            })
        }.sheet(isPresented: $showReminderDetail) {
            ReminderDetailView(reminder: Binding($selectedReminder)!)
        }
    }
}

//#Preview {
//    ReminderListView(reminders: <#T##FetchedResults<Reminder>#>)
//}
