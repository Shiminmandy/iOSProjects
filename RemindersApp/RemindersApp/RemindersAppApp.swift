//
//  RemindersAppApp.swift
//  RemindersApp
//
//  Created by Shimin Cheng on 2025-03-02.
//

import SwiftUI
import UserNotifications
@main
struct RemindersAppApp: App {
    
    init(){
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert,.sound,.badge]){ granted, error in
            if granted{
                // notification is granted
            }else{
                // display message to the user
            }
        }
    }
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(\.managedObjectContext, CoreDataProvider.shared.persistentContainer.viewContext)
        }
    }
}
