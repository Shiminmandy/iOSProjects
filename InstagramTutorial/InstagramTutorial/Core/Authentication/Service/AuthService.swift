//
//  AuthService.swift
//  InstagramTutorial
//
//  Created by Shimin Cheng on 2025-02-11.
//

import Foundation
import FirebaseAuth
import Firebase
import FirebaseFirestore
//import FirebaseFirestoreSwift

class AuthService{
    
    @Published var userSession: FirebaseAuth.User? // 用于辅助确认用户是否注册登入
    @Published var currentUser: User?
    
    // 单例模式 singleton pattern， 只有这一个全局实例
    // 所有地方都用的这一个实例，保证数据不会丢失或被多个实例覆盖
    // 一旦创建多个实例，实例之间不会共享同一个用户状态，例如多个实例有不同的userSession
    // 若不使用singleton，init（）中的监听器会不断增加导致数据内存泄漏
    static let shared = AuthService()
    
    init(){
//        self.userSession = Auth.auth().currentUser

        Task{
            try await loadUserData()
        }
    }
    
    @MainActor
    func login(withEmail email: String, password: String) async throws{
        do{
            // 调用来自于firestore的createUser（）
            let result = try await Auth.auth().signIn(withEmail: email, password: password)
            self.userSession = result.user
            try await loadUserData()
        }catch{
            print("DEBUG: Failed to login with error \(error.localizedDescription)")
        }
    }
    
    @MainActor
    func createUser(email: String, password: String , username: String) async throws{
        do{
            // 调用来自于firestore的createUser（）
            let result = try await Auth.auth().createUser(withEmail: email, password: password)
            self.userSession = result.user
//            print("DEBUG: Did create user...")
//            print(userSession?.email ?? "")
            await uploadUserData(uid: result.user.uid, username: username, email: email)
//           print("DEBUG; Did upload user data...")

        }catch{
            print("DEBUG: Failed to register user with error \(error.localizedDescription)")
        }
    }
    
    // load user data from backend firestore, and print it out at front end
    
    @MainActor
    func loadUserData() async throws {
        self.userSession = Auth.auth().currentUser
//        // get current user uid from firestore
        guard let currentUid = userSession?.uid else {return}
//        
//        // from "users" collection, get current user's data, store in snapshot
        let snapshot = try await Firestore.firestore().collection("users").document(currentUid).getDocument()
//        print("DEBUG: Snapshot data is \(String(describing: snapshot.data()))")
        
        // snapshot.data() is a dictionary, [string:any]
        self.currentUser = try? snapshot.data(as: User.self)
    }
    
    func signout(){
        try? Auth.auth().signOut() // signout on the backend firebaase
        self.userSession = nil // frontend,contentView noticed change and back to loginpage
        self.currentUser = nil
    }
    
    // upload user data into the backend firestore
    private func uploadUserData(uid: String, username: String, email: String) async {
        let user = User(id: uid, username: username, email: email)
        self.currentUser = user
        guard let encodedUser = try? Firestore.Encoder().encode(user) else {return}
        
        // "users" can be any name of this collection
        try? await Firestore.firestore().collection("users").document(user.id).setData(encodedUser)
    }
}
