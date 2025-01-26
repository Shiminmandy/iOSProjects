//
//  TinderTutorialApp.swift
//  TinderTutorial
//
//  Created by Shimin Cheng on 2025-01-13.
//

import SwiftUI

@main
struct TinderTutorialApp: App {
    
    @StateObject var matchManager = MatchManager()
    
    var body: some Scene {
        WindowGroup {
            MainTabView()
                .environmentObject(matchManager)
        }
    }
}
