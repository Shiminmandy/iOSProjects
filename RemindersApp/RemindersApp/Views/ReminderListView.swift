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
    //we dont get reminders directly from core data here
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
    
    private func deleterReminder(_ indexSet: IndexSet){
        indexSet.forEach { index in
            let reminder = reminders[index]
            do{
                try ReminderService.deleteReminder(reminder)
            } catch{
                print(error)
            }
        }
    }
    
    var body: some View {
        VStack{
            List{
                ForEach(reminders) {reminder in
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
                }.onDelete(perform: deleterReminder)
                //        .sheet(isPresented: $showReminderDetail) {
                //            ReminderDetailView(reminder: Binding($selectedReminder)!)
                //        }
            }
        }
    }
}

// help to present preview
struct ReminderListViewContainer: View {
    
    @FetchRequest(sortDescriptors: [])
    private var reminderResults: FetchedResults<Reminder>
    
    var body: some View {
        ReminderListView(reminders: reminderResults)
    }
}

#Preview {
    
    ReminderListViewContainer()
        .environment(\.managedObjectContext, CoreDataProvider.shared.persistentContainer.viewContext)
}
