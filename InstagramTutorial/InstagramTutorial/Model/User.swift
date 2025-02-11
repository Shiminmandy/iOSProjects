//
//  User.swift
//  InstagramTutorial
//
//  Created by Shimin Cheng on 2025-02-04.
//

import Foundation

struct User: Identifiable, Codable,Hashable {
   
    let id: String
    var username: String
    var profileImageUrl: String?
    var fullname: String?
    var bio: String?
    let email: String // not allowed user to change the email
}

extension User{
    static var MOCK_USERS: [User] = [
        .init(id: NSUUID().uuidString, username: "zhaolusi1", profileImageUrl: "lusi2",fullname:"zhaolusi1" ,bio: "chinese actress",email: "zhaolusi@gmail.com"),
        .init(id: NSUUID().uuidString, username: "zhaolusi2", profileImageUrl: "lusi1",fullname:"zhaolusi2" ,bio: "chinese actress",email: "zhaolusi@gmail.com"),
        .init(id: NSUUID().uuidString, username: "zhaolusi3", profileImageUrl: "lusi3",fullname:"zhaolusi3" ,bio: "chinese actress",email: "zhaolusi@gmail.com"),
        .init(id: NSUUID().uuidString, username: "maomao", profileImageUrl: "lusi0",fullname:"maomao" ,bio: "cute cat",email: "cutecat@gmail.com"),
        .init(id: NSUUID().uuidString, username: "shimin", profileImageUrl: "lusi6",fullname:"shimin" ,bio: "student",email: "shimin@gmail.com")
    ]
}
