//
//  TUICallKitService.swift
//  ChatVideo
//
//  Created by Shimin Cheng on 2025-03-10.
//

import Foundation
import TUICore
import TUICallKit_Swift

class TUICallKitService {
    static let shared = TUICallKitService()
    
    private init() {} // 确保外部无法创建实例

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
            
        let userID = "denny"       // 请替换为您的 UserId
        let sdkAppID: Int32 = 1600076374  // 替换为你的 SDKAppID
        let secretKey = "0bb6cfb0b5d4d7e0a6a9330349a0549710eb6b69cee013ecfc921ad98961db97"  // 替换为你的 SecretKey
        
        // this func only ussed in development environment, other wise the secretKey will be stealing
        let userSig = GenerateTestUserSig.genTestUserSig(userID: userID, sdkAppID: Int(sdkAppID), secretKey: secretKey)

        TUILogin.login(sdkAppID, userID: userID, userSig: userSig) {
          print("login success")
        } fail: { code, message in
          print("login failed, code: \(code), error: \(message ?? "nil")")
        }

        return true
    }

}


