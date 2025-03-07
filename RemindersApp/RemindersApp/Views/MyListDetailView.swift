//
//  MyListDetailView.swift
//  RemindersApp
//
//  Created by Shimin Cheng on 2025-03-03.
//

import SwiftUI

struct MyListDetailView: View {
    
    let myList: MyList
    @State private var openAddReminder: Bool = false
    @State private var title: String = ""
    
    @FetchRequest(sortDescriptors: [])
    private var reminderResults: FetchedResults<Reminder>
    
    private var isFormValid: Bool {
        !title.isEmptyOrWithWhitespace
    }
    
    init(myList: MyList){
        self.myList = myList
        // allows it dynamically fetch remider results based on MyList
        _reminderResults = FetchRequest(fetchRequest: ReminderService.getRemindersByList(myList: myList))
    }
    
    var body: some View {
        
        VStack{
            
            // Display List of Reminders
            ReminderListView(reminders: reminderResults)
            
            HStack{
                Image(systemName: "plus.circle.fill")
                Button("New Reminder"){
                    openAddReminder = true
                }
            }.foregroundStyle(.blue)
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding()
        }.alert("New Reminder", isPresented: $openAddReminder) {
            TextField("", text: $title)
            Button("Cancel", role: .cancel){}
            Button("Done"){
                if isFormValid{
                    // Save Reminder to MyList
                    do{
                        try ReminderService.saveReminderToMyList(myList: myList, reminderTitle: title)
                        title = ""
                    }catch{
                        print(error)
                    }
                }
            }
        }
    }
}

#Preview {
    MyListDetailView(myList: PreviewData.myList)
}
