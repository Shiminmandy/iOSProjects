//
//  ReminderListView.swift
//  RemindersApp
//
//  Created by Shimin Cheng on 2025-03-07.
//

import SwiftUI

struct ReminderListView: View {
    
    //we dont get from coredata
    let reminders: FetchedResults<Reminder>
    
    var body: some View {
        List(reminders) {reminder in
            ReminderCellView(reminder: reminder)
        }
    }
}

//#Preview {
//    ReminderListView()
//}
