//
//  MatchManager.swift
//  TinderTutorial
//
//  Created by Shimin Cheng on 2025-01-25.
//

import Foundation

class MatchManager: ObservableObject{
    
    @Published var matchedUser: User?
    
    func checkForMatch(withUser user: User) {
        
        let didMatch = Bool.random()
        
        if didMatch{
            matchedUser = user
        }
    }
}
