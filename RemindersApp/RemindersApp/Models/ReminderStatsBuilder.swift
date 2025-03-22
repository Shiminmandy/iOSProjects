//
//  ReminderStatsBuilder.swift
//  RemindersApp
//
//  Created by Shimin Cheng on 2025-03-22.
//

import Foundation
import SwiftUI

struct ReminderStatsValues {
    var todayCount: Int = 0
    var scheduledCount: Int = 0
    var allCount: Int = 0
    var completedCount: Int = 0
}

struct ReminderStatsBuilder {
    
    func build(myListResults: FetchedResults<MyList>) -> ReminderStatsValues{
        
        let remindersArray = myListResults.map{
            $0.remindersArray
        }.reduce([], +)
    }
}
