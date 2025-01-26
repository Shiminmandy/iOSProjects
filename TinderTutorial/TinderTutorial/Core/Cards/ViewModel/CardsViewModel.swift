//
//  CardsViewModel.swift
//  TinderTutorial
//
//  Created by Shimin Cheng on 2025-01-17.
//

import Foundation

class CardsViewModel: ObservableObject{
    @Published var cardModels = [CardModel]() // 初始化一个包含CardModel类型的空数组
    @Published var buttonSwipeAction: SwipeAction?
    
    private let service: CardService  // CardService里面包含一个数组，初始化为了将这个数组传进当前CardsViewModel
    
    init(service: CardService){ //初始化阶段就抓取用户数据返回数组
        self.service = service
        Task{ await fetchCardModels()}
    }
    
    func fetchCardModels() async{  //方便func复用
        
        do{
            self.cardModels = try await service.fetchCardModels()
        }catch{
            print("DEBUG: Failed to fetch cards with error: \(error)")
        }
    }
    
    func removeCard(_ card: CardModel){
         // 在用户数组中找到id和输入的cardmodel一样的用户，标记index并在数组中删除
        guard let index = cardModels.firstIndex(where: {$0.id == card.id}) else { return }
        cardModels.remove(at: index)
        
    }
}
