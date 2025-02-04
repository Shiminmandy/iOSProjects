//
//  User.swift
//  InstagramTutorial
//
//  Created by Shimin Cheng on 2025-02-04.
//

import Foundation

struct User: Identifiable, Codable {
   
    let id: String
    var username: String
    var profileImageUrl: String?
    var fullname: String?
    var bio: String?
    let email: String // not allowed user to change the email
}

