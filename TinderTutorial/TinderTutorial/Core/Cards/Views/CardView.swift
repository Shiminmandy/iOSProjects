//
//  CardView.swift
//  TinderTutorial
//
//  Created by Shimin Cheng on 2025-01-13.
//

import SwiftUI

struct CardView: View {
    @ObservedObject var viewModel: CardsViewModel
    @EnvironmentObject var matchManager: MatchManager
    
    @State private var xOffset: CGFloat = 0
    @State private var degrees: Double = 0
    @State private var currentImageIndex = 1
    @State private var showProfileModel = false
    
//    @State private var mockImages = [
//        "UserOne1",
//        "UserOne2",
//        "UserOne3",
//        "UserOne4"
//    ]
//    
    let model: CardModel
    
    var body: some View {
        ZStack(alignment: .bottom){
            
            ZStack(alignment: .top) {
                
                Image(user.profileImageURLs[currentImageIndex])
                    .resizable()
                    .scaledToFill()
                    .frame(width: SizeConstants.cardWidth, height: SizeConstants.cardHeight)
                    .overlay{
                        ImageScrollingOverlay(currentImageIndex: $currentImageIndex,imageCount: imageCount)
                    }
                CardImageIndicatorView(currentImageIndex: currentImageIndex, imageCount: imageCount)
                
                SwipActionIndicatorView(xOffset: $xOffset)
                    .padding(.horizontal,20)
            }
                
            UserInfoView(showProfileModel: $showProfileModel,user: user)
               
        }
        .fullScreenCover(isPresented: $showProfileModel){
            UserProfileView(user: user)
        }
        .onReceive(viewModel.$buttonSwipeAction, perform: {action in
            onReceiveSwipeAction(action)
        })
        .frame(width: SizeConstants.cardWidth, height: SizeConstants.cardHeight)
        .clipShape(RoundedRectangle(cornerRadius: 10))
        .offset(x: xOffset)
        .rotationEffect(.degrees(degrees))
        .animation(.snappy, value: xOffset)
        .gesture(
            DragGesture()
                .onChanged(onDragChanged(_:))
                .onEnded(onDragEnded(_:))
        )
        
    }
}

private extension CardView{
    
    var user: User{
        return model.user
    }
    
    var imageCount: Int {
        return user.profileImageURLs.count
    }
}

// 若往左或往右超出cutoff，那么图片飞出主界面
private extension CardView{
    func returnToCenter() {
        xOffset = 0
        degrees = 0
    }
    
    func swipeRight() {
        
        withAnimation {
            xOffset = 500
            degrees = 12
        } completion: {
            viewModel.removeCard(model) //删掉数组中的user
            matchManager.checkForMatch(withUser: user)
        }

    }
    
    func swipeLeft() {
        
        withAnimation {
            xOffset = -500
            degrees = -12
        } completion: {
            viewModel.removeCard(model)
        }
        
    }
    
    // 和图片底下两个按钮有关
    func onReceiveSwipeAction(_ action: SwipeAction?){
        guard let action else{return}
        
        let topCard = viewModel.cardModels.last 
        
        if topCard == model { //确保滑动动作仅应用到最顶层卡片
            switch action{
            case .reject:
                swipeLeft()
            case .like:
                swipeRight()
            }
        }
    }
}

// extension of how picture draged
private extension CardView{
    
    func onDragChanged(_ value: _ChangedGesture<DragGesture>.Value){
        xOffset = value.translation.width
        degrees = Double(value.translation.width/25)
    }
    
    func onDragEnded(_ value: _ChangedGesture<DragGesture>.Value){
        let width = value.translation.width
        if abs(width) < abs(SizeConstants.screenCutoff) {
            returnToCenter()
            return
        }
        
        if width >= SizeConstants.screenCutoff{
            swipeRight()
        }else{
            swipeLeft()
        }
    }
}



#Preview {
    CardView(viewModel: CardsViewModel(service: CardService()),model: CardModel(user: MockData.users[1]))
}
