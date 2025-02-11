//
//  AuthService.swift
//  InstagramTutorial
//
//  Created by Shimin Cheng on 2025-02-11.
//

import Foundation
import FirebaseAuth

class AuthService{
    
    @Published var userSession: FirebaseAuth.User? // 用于辅助确认用户是否注册登入
    
    func login(withEmail email: String, password: String) async throws{
        
    }
    
    func createUser(email: String, password: String , username: String) async throws{
        
    }
    
    func loadUserData() async throws {
        
    }
    
    func signout(){
        
    }
}
