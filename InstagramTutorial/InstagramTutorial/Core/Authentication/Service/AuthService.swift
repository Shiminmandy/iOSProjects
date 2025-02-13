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
    
    // 单例模式 singleton pattern， 只有这一个全局实例
    // 所有地方都用的这一个实例，保证数据不会丢失或被多个实例覆盖
    // 一旦创建多个实例，实例之间不会共享同一个用户状态，例如多个实例有不同的userSession
    // 若不使用singleton，init（）中的监听器会不断增加导致数据内存泄漏
    static let shared = AuthService()
    
    init(){
        self.userSession = Auth.auth().currentUser
    }
    func login(withEmail email: String, password: String) async throws{
        
    }
    
    func createUser(email: String, password: String , username: String) async throws{
        print("Email is \(email)")
    }
    
    func loadUserData() async throws {
        
    }
    
    func signout(){
        
    }
}
