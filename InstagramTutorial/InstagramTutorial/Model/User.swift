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
        .init(id: NSUUID().uuidString, username: "zhaolusi1", profileImageUrl: "lusi2",fullname:"zhaolusi" ,bio: "chinese actress",email: "zhaolusi@gmail.com"),
        .init(id: NSUUID().uuidString, username: "zhaolusi2", profileImageUrl: "lusi1",fullname:"zhaolusi" ,bio: "chinese actress",email: "zhaolusi@gmail.com"),
        .init(id: NSUUID().uuidString, username: "zhaolusi3", profileImageUrl: "lusi3",fullname:"zhaolusi" ,bio: "chinese actress",email: "zhaolusi@gmail.com"),
        .init(id: NSUUID().uuidString, username: "zhaolusi4", profileImageUrl: "lusi4",fullname:"zhaolusi" ,bio: "chinese actress",email: "zhaolusi@gmail.com"),
        .init(id: NSUUID().uuidString, username: "zhaolusi5", profileImageUrl: "lusi5",fullname:"zhaolusi" ,bio: "chinese actress",email: "zhaolusi@gmail.com")
    ]
}
