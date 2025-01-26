//
//  CardStackView.swift
//  TinderTutorial
//
//  Created by Shimin Cheng on 2025-01-17.
//

import SwiftUI

struct CardStackView: View {
    
    @State private var showMatchView = false
    @StateObject var viewModel = CardsViewModel(service: CardService()) // 获取到实例，包含抓取好的[CardModel]数组
    
//    @StateObject var matchManager = MatchManager()
    @EnvironmentObject var matchManager: MatchManager
    
    var body: some View {
        NavigationStack{
            ZStack {
                VStack(spacing: 16) {
                    ZStack{
                        ForEach(viewModel.cardModels){ card in
                            CardView(viewModel: viewModel,model: card) 
                        }
                    }
                    //            .onChange(of: viewModel.cardModels) {oldValue, newValue in
                    //                print("DEBUG: Old value count is \(oldValue.count)")
                    //                print("DEBUG: new value count is \(newValue.count)")
                    //            }
                    if !viewModel.cardModels.isEmpty{
                        SwipeActionButtonView(viewModel: viewModel)
                    }
                }
                .blur(radius: showMatchView ? 20 : 0)
                
                if showMatchView {
                    UserMatchView(show: $showMatchView)
                }
                
            }
            .animation(.easeOut,value: showMatchView)
            .onReceive(matchManager.$matchedUser, perform: { user in
                showMatchView = user != nil
            })
            .toolbar{
                ToolbarItem(placement: .topBarLeading){
                    Image("Tinder-Logo")
                        .resizable()
                        .scaledToFill()
                        .frame(width: 88)
                }
            }
        }
    }
}

#Preview {
    CardStackView()
        .environmentObject(MatchManager())
}
