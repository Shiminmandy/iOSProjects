//
//  ContentViewModel.swift
//  InstagramTutorial
//
//  Created by Shimin Cheng on 2025-02-11.
//

import Foundation
import FirebaseAuth
import Combine

// listening for changes

class ContentViewModel: ObservableObject {
    
    private let service = AuthService.shared
    private var cancellables = Set<AnyCancellable>()
    
    @Published var userSession: FirebaseAuth.User?
    @Published var currentUser: User?
    
    init(){
        setupSubscribers()
    }
    
    // 使用combine监听usersession
    // 当 authservice里的 usersession有变化时，sink闭包将新的usersession传给viewmodel中的usersession
    func setupSubscribers() {
        service.$userSession.sink { [weak self] userSession in
            self?.userSession = userSession
        }
        .store(in: &cancellables)
        
        // listen to currentUser
        service.$currentUser.sink { [weak self] currentUser in
            self?.currentUser = currentUser
        }
        .store(in: &cancellables)
    }
}
