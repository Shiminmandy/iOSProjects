//
//  ReminderDetailView.swift
//  RemindersApp
//
//  Created by Shimin Cheng on 2025-03-07.
//

import SwiftUI

struct ReminderDetailView: View{
    
    @Binding var reminder: Reminder
    @State var editConfig: ReminderEditConfig = ReminderEditConfig()
    
    var body: some View{
        NavigationStack{
            VStack{
                List{
                    Section{
                        TextField("Title", text: $editConfig.title)
                        TextField("Notes", text: $editConfig.notes ?? "")
                    }
                    
                    Section{
                        Toggle(isOn: $editConfig.hasDate) {
                            Image(systemName: "calendar")
                                .foregroundStyle(.red)
                        }
                        
                        if editConfig.hasDate {
                            DatePicker("Select Date", selection: $editConfig.reminderDate ?? Date(), displayedComponents: .date)
                        }
                    }
                }
            }.onAppear{
                editConfig = ReminderEditConfig(reminder: reminder)
            }
        }
    }
}

#Preview {
    ReminderDetailView(reminder: .constant(PreviewData.reminder))
}
