//
//  SearchViewModel.swift
//  InstagramTutorial
//
//  Created by Shimin Cheng on 2025-02-16.
//

import Foundation

class SearchViewModel: ObservableObject{
    
    @Published var users = [User]() // ()表示创建一个空数组
    
    init() {
        Task {
            try await fetchAllUsers()
        }
    }
    
    @MainActor
    func fetchAllUsers() async throws {
        
        // 在闭包里self不可以省略
        self.users = try await UserService.fetchAllUsers()
  
    }
}
