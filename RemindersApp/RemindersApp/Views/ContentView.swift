//
//  ContentView.swift
//  RemindersApp
//
//  Created by Shimin Cheng on 2025-03-02.
//

import SwiftUI

struct ContentView: View {
    
    @FetchRequest(sortDescriptors: [])
    private var myListResults: FetchedResults<MyList>
    
    @State private var isPresented: Bool = false
    var body: some View {
        NavigationStack{
            VStack {
                
                MyListView(myLists: myListResults)
                
                //Spacer()
                
                Button{
                    isPresented = true
                } label: {
                    Text("Add List")
                        .frame(maxWidth: .infinity, alignment: .trailing)
                        .font(.headline)
                }.padding()
            }.sheet(isPresented: $isPresented){
                NavigationStack{
                    AddNewListView{name , color in
                        // save the list to the database
                        do{
                            try ReminderService.saveMyList(name, color)
                        }catch{
                            print(error)
                        }
                    }
                }
            }
            .padding()
        }
    }
}

#Preview {
    ContentView()
        .environment(\.managedObjectContext,CoreDataProvider.shared.persistentContainer.viewContext)
}
