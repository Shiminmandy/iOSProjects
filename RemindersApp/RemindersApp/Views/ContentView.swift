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
    @FetchRequest(sortDescriptors: [])
    private var searchResults: FetchedResults<Reminder>
    
    @State private var search = ""
    @State private var searching: Bool = false
    @State private var isPresented: Bool = false
    
    var body: some View {
        NavigationStack{
            VStack {
                ScrollView{
                    MyListView(myLists: myListResults)
                    
                    //Spacer()
                    
                    Button{
                        isPresented = true
                    } label: {
                        Text("Add List")
                            .frame(maxWidth: .infinity, alignment: .trailing)
                            .font(.headline)
                    }.padding()
                }
            }.onChange(of: search, perform: { searchTerm in
                searching = !searchTerm.isEmpty ? true: false
                searchResults.nsPredicate = ReminderService.getRemindersBySearchTerm(search).predicate
            })
            .overlay(alignment: .center, content: {
                ReminderListView(reminders: searchResults)
                    .opacity(searching ? 1.0 : 0)
            }).frame(maxWidth: .infinity, maxHeight: .infinity)
                .padding()
                .navigationTitle("Reminders")
            .sheet(isPresented: $isPresented){
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
        }.searchable(text: $search)
    }
}

#Preview {
    ContentView()
        .environment(\.managedObjectContext,CoreDataProvider.shared.persistentContainer.viewContext)
}
