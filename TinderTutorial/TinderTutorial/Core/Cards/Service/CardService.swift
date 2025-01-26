//
//  CardService.swift
//  TinderTutorial
//
//  Created by Shimin Cheng on 2025-01-17.
//

import Foundation

// 只负责数据的获取：获取不同的用户
struct CardService {
    func fetchCardModels() async throws -> [CardModel]{
        
        let users = MockData.users // hardcode的用户数组 类型是[User] $0是当前User数组，遍历每一个，并且转化为CardModel类型
        return users.map({CardModel(user: $0)})  // 返回的是[CardModel]数组
        // transform each element into new type and return a new collection, the old collection not affected
    }
}
