//
//  MyList+CoreDataClass.swift
//  RemindersApp
//
//  Created by Shimin Cheng on 2025-03-02.
//

import Foundation
import CoreData

@objc(MyList)
public class MyList: NSManagedObject{
    
    var remindersArray: [Reminder] {
        reminders.allObjects.compactMap{ ($0 as! Reminder)} ?? []
    }
}
