//
//  CoreDataProvider.swift
//  RemindersApp
//
//  Created by Shimin Cheng on 2025-03-02.
//

import Foundation
import CoreData

class CoreDataProvider {
    
    static let shared = CoreDataProvider()
    
    let persistentContainer: NSPersistentContainer
    
    private init() {
        
        // register transformers
        ValueTransformer.setValueTransformer(UIColorTransformer(), forName: NSValueTransformerName("UIColorTransformer"))
        
        persistentContainer = NSPersistentContainer(name: "RemindersApp")
        // closure is similar to functions but lightweight and flexible
        persistentContainer.loadPersistentStores { description, error in
            if let error{
                fatalError("Error initializing RemindersModel \(error)")
            }
        }
    }
}
