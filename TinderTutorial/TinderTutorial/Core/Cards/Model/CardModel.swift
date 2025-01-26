//
//  CardModel.swift
//  TinderTutorial
//
//  Created by Shimin Cheng on 2025-01-17.
//

import Foundation

struct CardModel{
    let user: User
}

extension CardModel: Identifiable, Hashable{
    var id: String { return user.id}
}
