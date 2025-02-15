//
//  RegisrationViewModel.swift
//  InstagramTutorial
//
//  Created by Shimin Cheng on 2025-02-12.
//

import Foundation

@MainActor
class RegisrationViewModel: ObservableObject {
    @Published var username = ""
    @Published var email = ""
    @Published var password = ""
    
    
    func createUser() async throws {
        try await AuthService.shared.createUser(email: email, password: password, username: username)
        
        username = ""
        email = ""
        password = ""
    }
}
