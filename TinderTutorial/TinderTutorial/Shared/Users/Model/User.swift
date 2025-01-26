//
//  User.swift
//  TinderTutorial
//
//  Created by Shimin Cheng on 2025-01-17.
//

import Foundation

struct User: Identifiable,Hashable{
    let id: String
    let fullname: String
    var age: Int
    var profileImageURLs: [String]
}
