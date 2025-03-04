//
//  MyListView.swift
//  RemindersApp
//
//  Created by Shimin Cheng on 2025-03-02.
//

import SwiftUI

struct MyListView: View {
    
    let myLists: FetchedResults<MyList>
    
    var body: some View {
        NavigationStack{
            
            if myLists.isEmpty{
                Spacer()
                Text("No reminders found")
            }else{
                ForEach(myLists){ list in
                    NavigationLink(value: list) {
                        VStack{
                            MyListCellView(myList: list)
                                .frame(maxWidth: .infinity,alignment: .leading)
                                .padding([.leading], 10)
                                .font(.title3)
                            Divider()
                        }
                    }.scrollContentBackground(.hidden)
                        .navigationDestination(for: MyList.self) { list in
                            MyListDetailView(myList: list)
                                .navigationTitle(list.name)
                        }
                    
                }
            }
        }
    }
}

//#Preview {
//    MyListView()
//}
