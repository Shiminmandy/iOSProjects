//
//  User.swift
//  InstagramTutorial
//
//  Created by Shimin Cheng on 2025-02-04.
//

import Foundation
import Firebase
import FirebaseAuth

struct User: Identifiable, Codable,Hashable {
   
    let id: String
    var username: String
    var profileImageUrl: String?
    var fullname: String?
    var bio: String?
    let email: String // not allowed user to change the email
    
    //add after fetchAllUsers data from backend
    // get uid of login account from backend 
    var isCurrentUser: Bool{
        guard let currentUid = Auth.auth().currentUser?.uid else { return false}
        return currentUid == id
    }
}


extension User{
    static var MOCK_USERS: [User] = [
        .init(id: NSUUID().uuidString, username: "zhaolusi1", profileImageUrl: nil,fullname:"zhaolusi1" ,bio: "chinese actress",email: "zhaolusi1@gmail.com"),
        .init(id: NSUUID().uuidString, username: "zhaolusi2", profileImageUrl: nil,fullname:"zhaolusi2" ,bio: "chinese actress",email: "zhaolusi2@gmail.com"),
        .init(id: NSUUID().uuidString, username: "zhaolusi3", profileImageUrl: nil,fullname:"zhaolusi3" ,bio: "chinese actress",email: "zhaolusi3@gmail.com"),
        .init(id: NSUUID().uuidString, username: "maomao", profileImageUrl: nil,fullname:"maomao" ,bio: "cute cat",email: "cutecat@gmail.com"),
        .init(id: NSUUID().uuidString, username: "shimin", profileImageUrl: nil,fullname:"shimin" ,bio: "student",email: "shimin@gmail.com")
    ]
}
