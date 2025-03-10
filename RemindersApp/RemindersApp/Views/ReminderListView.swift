//
//  ReminderListView.swift
//  RemindersApp
//
//  Created by Shimin Cheng on 2025-03-07.
//

import SwiftUI

struct ReminderListView: View {
    
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
    
    var body: some View {
        List(reminders) {reminder in
            ReminderCellView(reminder: reminder, onEvent: {event in
                switch event{
                case .onCheckChange(let reminder, let isCompleted):
                    reminderCheckedChanged(reminder: reminder, isCompleted: isCompleted)
                    
                case .onSelect(let reminder):
                    print("onSelect")
                    
                case .onInfo:
                    print("onInfo")
                }
            })
        }
    }
}

//#Preview {
//    ReminderListView()
//}
