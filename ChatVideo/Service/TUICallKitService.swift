//
//  TUICallKitService.swift
//  ChatVideo
//
//  Created by Shimin Cheng on 2025-03-10.
//

import SwiftUI
import TUICore
import TUICallKit_Swift

class TUICallKitService: ObservableObject {
    @Published var isLoggedIn = false
    @Published var userID = "denny"
    
    private let sdkAppID: Int32 = 1600076374  // 替换为你的 SDKAppID
    private let secretKey = "0bb6cfb0b5d4d7e0a6a9330349a0549710eb6b69cee013ecfc921ad98961db97"  // 替换为你的 SecretKey
    
    

    func login() {
        let userSig = GenerateTestUserSig.genTestUserSig(userID: userID, sdkAppID: Int(sdkAppID), secretKey: secretKey)
        
        TUILogin.login(sdkAppID, userID: userID, userSig: userSig) {
            DispatchQueue.main.async {
                self.isLoggedIn = true
                print("Login successful: \(self.userID)")
            }
        } fail: { code, message in
            print("Login failed, code: \(code), error: \(message ?? "nil")")
        }
    }
    
    func call() {
        guard isLoggedIn else {
            print("User not logged in")
            return
        }
        
            TUICallKit.createInstance().calls(userIdList: ["mike"], callMediaType: .video, params: nil) {
                print("Call successful")
            } fail: { code, message in
                print("Call failed, error: \(message ?? "unknown error")")
            }
        }
    }

