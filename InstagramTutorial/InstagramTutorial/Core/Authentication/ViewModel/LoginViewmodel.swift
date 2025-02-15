//
//  loginViewmodel.swift
//  InstagramTutorial
//
//  Created by Shimin Cheng on 2025-02-14.
//

import Foundation

class LoginViewmodel: ObservableObject{
    @Published var email = ""
    @Published var password = ""
    
    func signIn() async throws{
        try await AuthService.shared.login(withEmail: email, password: password)
    }
}
