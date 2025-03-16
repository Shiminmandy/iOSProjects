//
//  ReminderDetailView.swift
//  RemindersApp
//
//  Created by Shimin Cheng on 2025-03-07.
//

import SwiftUI

struct ReminderDetailView: View{
    
    // 本视图修改reminder会绑定父视图的reminder跟着改变
    @Binding var reminder: Reminder
    @State var editConfig: ReminderEditConfig = ReminderEditConfig()
    @Environment(\.dismiss) var dismiss
    
    private var isFormValid: Bool{
        !editConfig.title.isEmpty
    }
    
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
                        
                        Toggle(isOn: $editConfig.hasTime) {
                            Image(systemName: "clock")
                                .foregroundStyle(.blue)
                        }
                        
                        if editConfig.hasTime {
                            DatePicker("Select Time", selection: $editConfig.reminderTime ?? Date(), displayedComponents: .hourAndMinute)
                        }
                        
                        Section {
                            NavigationLink{
                                SelectListView(selectedList: $reminder.list)
                            }label: {
                                HStack{
                                    Text("List")
                                    Spacer()
                                    Text(reminder.list?.name ?? "")
                                }
                            }
                        }
                    }.onChange(of: editConfig.hasDate) {
                        hasDate in
                        
                        if hasDate{
                            editConfig.reminderDate = Date()
                        }
                    }.onChange(of: editConfig.hasTime) {
                        hasTime in
                        
                        if hasTime{
                            editConfig.reminderTime = Date()
                        }
                    }
                }
            }.onAppear{
                editConfig = ReminderEditConfig(reminder: reminder)
            }
            .toolbar{
                
                ToolbarItem(placement: .principal) {
                    Text("Details")
                }
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done"){
                            do{
                                let _ = try ReminderService.updateReminder(reminder: reminder, editConfig: editConfig)
                            }catch{
                                print(error)
                            }
                        }.disabled(!isFormValid)
                    
                }
                
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel"){
                        dismiss()
                    }
                }
            }
        }
    }
}

#Preview {
    ReminderDetailView(reminder: .constant(PreviewData.reminder))
}
