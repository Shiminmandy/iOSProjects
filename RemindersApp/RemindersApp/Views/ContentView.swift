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
    
    @FetchRequest(fetchRequest: ReminderService.remindersByStatType(statType: .today))
    private var todayResults: FetchedResults<Reminder>
    
    @FetchRequest(fetchRequest: ReminderService.remindersByStatType(statType: .all))
    private var allResults: FetchedResults<Reminder>
    
    @FetchRequest(fetchRequest: ReminderService.remindersByStatType(statType: .scheduled))
    private var scheduledResults: FetchedResults<Reminder>
    
    @FetchRequest(fetchRequest: ReminderService.remindersByStatType(statType: .completed))
    private var completedResults: FetchedResults<Reminder>
    
    @State private var search = ""
    @State private var searching: Bool = false
    @State private var isPresented: Bool = false
    
    private var reminderStatsBuilder = ReminderStatsBuilder()
    @State private var reminderStatsValues = ReminderStatsValues()
    
    var body: some View {
        NavigationStack{
            VStack {
                ScrollView{
                    
                    HStack{
                        
                        NavigationLink{
                            ReminderListView(reminders: todayResults)
                        }label: {
                            ReminderStatsView(icon: "calendar", title: "Today",count: reminderStatsValues.todayCount)
                        }
                        
                        NavigationLink{
                            ReminderListView(reminders: allResults)
                        }label: {
                            ReminderStatsView(icon: "tray.circle.fill", title: "All",count: reminderStatsValues.allCount,iconColor: .black)
                            }
                        }
                        
                        
                    
                    HStack{
                        
                        NavigationLink{
                            ReminderListView(reminders: scheduledResults)
                        }label: {
                            ReminderStatsView(icon: "calendar.circle.fill", title: "Schedule",count: reminderStatsValues.scheduledCount,iconColor: .red)
                        }
                        
                        NavigationLink{
                            ReminderListView(reminders: completedResults)
                        }label: {
                            ReminderStatsView(icon: "checkmark.circle.fill", title: "Completed",count: reminderStatsValues.completedCount)
                        }
                        
                       
                    }
                    
                    Text("My Lists")
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .font(.largeTitle)
                        .bold()
                        .padding()
                    
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
            .onAppear{
                reminderStatsValues = reminderStatsBuilder.build(myListResults: myListResults)
            }
            .padding()
        }.searchable(text: $search)
    }
}

#Preview {
    ContentView()
        .environment(\.managedObjectContext,CoreDataProvider.shared.persistentContainer.viewContext)
}
