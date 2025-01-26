//
//  MockData.swift
//  TinderTutorial
//
//  Created by Shimin Cheng on 2025-01-17.
//

import Foundation

struct MockData{
    
    static let users: [User] = [
        
        .init(
            id: NSUUID().uuidString,
            fullname: "anny",
            age: 28,
            profileImageURLs: ["UserOne1","UserOne2","UserOne3","UserOne4"]
        ),
        .init(
            id: NSUUID().uuidString,
            fullname: "hanna",
            age: 25,
            profileImageURLs: ["UserTwo1","UserTwo2","UserTwo3","UserTwo4"]
        ),
        .init(
            id: NSUUID().uuidString,
            fullname: "bella",
            age: 21,
            profileImageURLs: ["UserOne1","UserOne2","UserOne3","UserOne4"]
        ),
        .init(
            id: NSUUID().uuidString,
            fullname: "cindy",
            age: 20,
            profileImageURLs: ["UserTwo1","UserTwo2","UserTwo3","UserTwo4"]
        ),
    ]
    
}
