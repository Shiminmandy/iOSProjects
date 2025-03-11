//
//  ViewController.swift
//  ChatVideo
//
//  Created by Shimin Cheng on 2025-03-10.
//

import Foundation
import TUICore
import TUICallKit_Swift
import UIKit

class ViewController: UIViewController {
    
    let loginBtn = {
        let btn = UIButton(frame:CGRect(x: 100, y: 100, width: 50, height: 20))
        btn.setTitle("login", for: .normal)
        btn.backgroundColor = .gray
        return btn
    }()
    
    let callBtn = {
        let btn = UIButton(frame:CGRect(x: 100, y: 150, width: 50, height: 20))
        btn.setTitle("call", for: .normal)
        btn.backgroundColor = .gray
        return btn
    }()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        loginBtn.addTarget(self, action: #selector(login), for: .touchUpInside)
        callBtn.addTarget(self, action: #selector(call), for: .touchUpInside)
        
        view.addSubview(loginBtn)
        view.addSubview(callBtn)
    }
    
    @objc func call(){
        
        TUICallKit.createInstance().calls(userIdList: ["mike"], callMediaType: .video, params: nil) {
            print("call success---------------")
        } fail: { code, message in
            print("call fail--------------")
            print(message!)
        }

    }
    
    @objc func login(){
        let userID = "mike"       // 请替换为您的 UserId
        let sdkAppID: Int32 = 1600076374  // 替换为你的 SDKAppID
        let secretKey = "0bb6cfb0b5d4d7e0a6a9330349a0549710eb6b69cee013ecfc921ad98961db97"  // 替换为你的 SecretKey
        
        // this func only ussed in development environment, other wise the secretKey will be stealing
        let userSig = GenerateTestUserSig.genTestUserSig(userID: userID, sdkAppID: Int(sdkAppID), secretKey: secretKey)

        
        TUILogin.login(sdkAppID, userID: userID, userSig: userSig) {
          print("login success---------------------------")
            print(userID)
        } fail: { code, message in
          print("login failed, code: \(code), error: \(message ?? "nil")")
        }
    }
}
